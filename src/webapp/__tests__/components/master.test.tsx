import * as React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import MasterLayout from '../../components/layout/master'
import { WithBrowserRouter } from '../helpers/withBrowserRouter'

describe('→ Component: MasterLayout', () => {
  test('→ contains Header', async () => {
    render(<WithBrowserRouter><MasterLayout /></WithBrowserRouter>)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', '/assets/logo.png')
  })
})
