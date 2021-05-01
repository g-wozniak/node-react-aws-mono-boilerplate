import * as React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import LayoutHeader from '../../components/layout/header'
import { WithBrowserRouter } from '../helpers/withBrowserRouter'

describe('→ Component: LayoutHeader', () => {
  test('→ displays logo image', async () => {
    render(<WithBrowserRouter><LayoutHeader /></WithBrowserRouter>)
    const img = screen.getByRole('img')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/assets/logo.png')
  })
})
