**Add file** → **Create new file**

**File name:** `src/main.jsx`

(typing `src/` will automatically create the folder)

Paste:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import SanzonateDashboard from './SanzonateDashboardV3.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SanzonateDashboard />
  </React.StrictMode>,
)
```

Commit. Next?
