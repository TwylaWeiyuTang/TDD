import { render, screen } from '@testing-library/react';
import Recipes from './Recipes'

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