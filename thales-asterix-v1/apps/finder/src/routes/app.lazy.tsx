import { useDataStore } from '@/stores/data'
import { Link, Navigate, createLazyFileRoute, Outlet } from '@tanstack/react-router'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export const Route = createLazyFileRoute('/app')({
  component: AppIndex,
})

function AppIndex() {
  const data = useDataStore((state) => state.data)

  if (!data) return <Navigate to="/" />
  return (
    <>
      <NavigationMenu className='p-2'>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link to="/app/metadata">
                Metadata
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link to="/app/revsisions">
                Revisions
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link to="/app/software-designer">
                Software Designer
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link to="/app/module-integrator">
                Module Integrator
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link to="/app/software">
                Software
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <hr />
      <div className='p-2'>
        <Outlet />
      </div>
    </>
  )
}