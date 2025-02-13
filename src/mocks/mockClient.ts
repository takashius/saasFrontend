import { Client } from 'src/types'

export const mockClient: Client = {
  created: {
    user: {
      _id: '64fbe61071af3ad203dba8b8',
      name: 'Erick',
      lastname: 'Hernandez'
    },
    date: '2024-03-15T14:52:58.862Z'
  },
  _id: '65f460caa895f66ef746b896',
  title: 'Club Tachira',
  name: 'Reinaldo',
  lastname: 'Vera',
  rif: '0000000',
  email: 'reinaldo.vs82@gmail.com',
  company: '65e8688766bf56f2228cbe87',
  addresses: [
    {
      title: 'Default',
      city: 'Caracas',
      line1: 'Pendiente',
      zip: '0',
      default: true,
      _id: '65f460caa895f66ef746b897'
    }
  ],
  active: true
}
