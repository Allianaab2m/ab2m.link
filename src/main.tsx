import { render } from 'solid-js/web'
import "./main.css"
import App from "./App"
import { Route, Router, Routes } from '@solidjs/router'

render(() =>
(
  <Router>
    <Routes>
      <Route path="/" component={App} />
    </Routes>
  </Router>
),
  document.getElementById('root')
)

