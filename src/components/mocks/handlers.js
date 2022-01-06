import { rest } from 'msw'

export const handlers = [
  rest.get('/payment/select', (req, res, ctx) => {
    //const { username } = req.body

console.log('testme')
    return res(
      ctx.json(
      {
        guidSource: 'f79e82e8-c34a-4dc7-a49e-9fadc0979fda',
        guidDestination: 'f79e82e8-c34a-4dc7-a49e-9fadc0979fdb',
        amount: 0.00,
        transactionDate: '1/1/2022',
        accountNameOwner: 'chase_brian',
      }
      )
    )
  }),
]
