/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'

// Create Virtual Routes

const AppLazyImport = createFileRoute('/app')()
const IndexLazyImport = createFileRoute('/')()
const AppIndexLazyImport = createFileRoute('/app/')()
const AppToolsLazyImport = createFileRoute('/app/tools')()
const AppSoftwareDesignerLazyImport = createFileRoute(
  '/app/software-designer',
)()
const AppSoftwareLazyImport = createFileRoute('/app/software')()
const AppRevsisionsLazyImport = createFileRoute('/app/revsisions')()
const AppModuleIntegratorLazyImport = createFileRoute(
  '/app/module-integrator',
)()
const AppMetadataLazyImport = createFileRoute('/app/metadata')()

// Create/Update Routes

const AppLazyRoute = AppLazyImport.update({
  path: '/app',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/app.lazy').then((d) => d.Route))

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const AppIndexLazyRoute = AppIndexLazyImport.update({
  path: '/',
  getParentRoute: () => AppLazyRoute,
} as any).lazy(() => import('./routes/app/index.lazy').then((d) => d.Route))

const AppToolsLazyRoute = AppToolsLazyImport.update({
  path: '/tools',
  getParentRoute: () => AppLazyRoute,
} as any).lazy(() => import('./routes/app/tools.lazy').then((d) => d.Route))

const AppSoftwareDesignerLazyRoute = AppSoftwareDesignerLazyImport.update({
  path: '/software-designer',
  getParentRoute: () => AppLazyRoute,
} as any).lazy(() =>
  import('./routes/app/software-designer.lazy').then((d) => d.Route),
)

const AppSoftwareLazyRoute = AppSoftwareLazyImport.update({
  path: '/software',
  getParentRoute: () => AppLazyRoute,
} as any).lazy(() => import('./routes/app/software.lazy').then((d) => d.Route))

const AppRevsisionsLazyRoute = AppRevsisionsLazyImport.update({
  path: '/revsisions',
  getParentRoute: () => AppLazyRoute,
} as any).lazy(() =>
  import('./routes/app/revsisions.lazy').then((d) => d.Route),
)

const AppModuleIntegratorLazyRoute = AppModuleIntegratorLazyImport.update({
  path: '/module-integrator',
  getParentRoute: () => AppLazyRoute,
} as any).lazy(() =>
  import('./routes/app/module-integrator.lazy').then((d) => d.Route),
)

const AppMetadataLazyRoute = AppMetadataLazyImport.update({
  path: '/metadata',
  getParentRoute: () => AppLazyRoute,
} as any).lazy(() => import('./routes/app/metadata.lazy').then((d) => d.Route))

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/app': {
      preLoaderRoute: typeof AppLazyImport
      parentRoute: typeof rootRoute
    }
    '/app/metadata': {
      preLoaderRoute: typeof AppMetadataLazyImport
      parentRoute: typeof AppLazyImport
    }
    '/app/module-integrator': {
      preLoaderRoute: typeof AppModuleIntegratorLazyImport
      parentRoute: typeof AppLazyImport
    }
    '/app/revsisions': {
      preLoaderRoute: typeof AppRevsisionsLazyImport
      parentRoute: typeof AppLazyImport
    }
    '/app/software': {
      preLoaderRoute: typeof AppSoftwareLazyImport
      parentRoute: typeof AppLazyImport
    }
    '/app/software-designer': {
      preLoaderRoute: typeof AppSoftwareDesignerLazyImport
      parentRoute: typeof AppLazyImport
    }
    '/app/tools': {
      preLoaderRoute: typeof AppToolsLazyImport
      parentRoute: typeof AppLazyImport
    }
    '/app/': {
      preLoaderRoute: typeof AppIndexLazyImport
      parentRoute: typeof AppLazyImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexLazyRoute,
  AppLazyRoute.addChildren([
    AppMetadataLazyRoute,
    AppModuleIntegratorLazyRoute,
    AppRevsisionsLazyRoute,
    AppSoftwareLazyRoute,
    AppSoftwareDesignerLazyRoute,
    AppToolsLazyRoute,
    AppIndexLazyRoute,
  ]),
])

/* prettier-ignore-end */
