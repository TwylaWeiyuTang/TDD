import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Recipes from './Recipes'
import AwesomeCounter from './AwesomeCounter';

import { setupServer } from 'msw/node'
import { rest } from 'msw'

const allRecipes = [
  {id: 1, title: 'Burger'},
  {id: 2, title: 'Pasta'},
  {id: 3, title: 'Pizza'}
]

const server = setupServer (
  rest.get('/api/recipes', (req, res, ctx) => {
    return res(ctx.json({recipes: allRecipes}));
  }),
);

// before all the test, we need to make sure our server is listening
beforeAll(() => server.listen())

// reset all the handlers after each test
afterEach(() => server.resetHandlers())

// make sure the close of the sever after all tests
afterAll(() => server.close())

test('renders the heading, form elements and recipes', async () => {
  render(<Recipes />);
  
  expect(screen.getByRole('heading')).toHaveTextContent('Recipe Finder')

  expect(screen.getByPlaceholderText('Enter an ingredient to find recipes...'))
    .toBeInTheDocument()

  expect(screen.getByRole('button')).toHaveTextContent('Find')

  const listItems = await screen.findAllByRole('listitem')
  expect(listItems).toHaveLength(3)
  expect(listItems[0]).toHaveTextContent('Burger')
  expect(listItems[1]).toHaveTextContent('Pasta')
  expect(listItems[2]).toHaveTextContent('Pizza')
});

// test error handeling when request fails
test('displays error message when fetching recipes is unsuccessful', async () => {
  // overwrite the previously defined server by using .use()
  server.use(
    rest.get('/api/recipes', (req, res, ctx) => {
      return res (
        ctx.status(500),
        ctx.json({message: "Internal Server Error"})
      )
    })
  )

  render(<Recipes />)

  expect(await screen.findByText('Failed to fetch recipes')).toBeInTheDocument()
  expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
})

test('Awesome Counter should have the correct title', () => {
  render(<AwesomeCounter />)

  expect(screen.getByRole('heading')).toHaveTextContent('Awesome Counter')
})

test('Awesome Counter should have the correct initial value when set to 7', () => {
  render(<AwesomeCounter initialValue={7} />)
  const count = screen.queryByText(7)
  expect(count).toBeVisible()
})

test('Awesome Counter should have a default value of 0', () => {
  render(<AwesomeCounter />)
  const count = screen.queryByText(0)
  expect(count).toBeVisible()
})

test('Awesome Counter should increase the value correctly when add is clicked once', () => {
  render(<AwesomeCounter initialValue={1}/>)
  const addButton = screen.getByText('Add')
  userEvent.click(addButton)
  const count = screen.queryByText(2)
  expect(count).toBeVisible()
})

test('Awesome Counter should increase the value correctly when add is clicked twice', () => {
  render(<AwesomeCounter initialValue={1}/>)
  const addButton = screen.getByText('Add')
  userEvent.click(addButton)
  userEvent.click(addButton)
  const count = screen.queryByText(3)
  expect(count).toBeVisible()
})

test('Awesome Counter should decrease the value correctly when remove is clicked once', () => {
  render(<AwesomeCounter initialValue={5}/>)
  const removeButton = screen.getByText('Remove')
  userEvent.click(removeButton)
  const count = screen.queryByText(4)
  expect(count).toBeVisible()
})

test('Awesome Counter should decrease the value correctly when remove is clicked twice', () => {
  render(<AwesomeCounter initialValue={5}/>)
  const removeButton = screen.getByText('Remove')
  userEvent.click(removeButton)
  userEvent.click(removeButton)
  const count = screen.queryByText(3)
  expect(count).toBeVisible()
})

test('Awesome Counter should not allow a negative number when the initial value is 0 and remove is clicked', () => {
  render(<AwesomeCounter initialValue={0}/>)
  const removeButton = screen.getByText('Remove')
  userEvent.click(removeButton)
  const count = screen.queryByText(0)
  expect(count).toBeVisible()
})

test('Awesome Counter should not allow a negative number when the initial value is 2 and remove is clicked 4 times', () => {
  render(<AwesomeCounter initialValue={2}/>)
  const removeButton = screen.getByText('Remove')
  userEvent.click(removeButton)
  userEvent.click(removeButton)
  userEvent.click(removeButton)
  userEvent.click(removeButton)
  const count = screen.queryByText(0)
  expect(count).toBeVisible()
})