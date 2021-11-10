/** When your routing table is too long, you can split it into small modules **/

import Layout from '@test/layout'

const tableRouter = {
  path: '/table',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'Table',
  meta: {
    title: 'Table',
    icon: 'table'
  },
  children: [
    {
      path: 'dynamic-table',
      component: () => import('@test/views/table/dynamic-table/index'),
      name: 'DynamicTable',
      meta: { title: 'Dynamic Table' }
    },
    {
      path: 'drag-table',
      component: () => import('@test/views/table/drag-table'),
      name: 'DragTable',
      meta: { title: 'Drag Table' }
    },
    {
      path: 'inline-edit-table',
      component: () => import('@test/views/table/inline-edit-table'),
      name: 'InlineEditTable',
      meta: { title: 'Inline Edit' }
    },
    {
      path: 'complex-table',
      component: () => import('@test/views/table/complex-table'),
      name: 'ComplexTable',
      meta: { title: 'Complex Table' }
    }
  ]
}
export default tableRouter
