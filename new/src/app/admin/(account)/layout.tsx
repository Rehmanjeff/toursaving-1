'use client'

import { useEffect, useState } from 'react'

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  Disclosure, 
  DisclosureButton, 
  DisclosurePanel
} from '@headlessui/react'
import {
  Bars3Icon,
  BellIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  CalendarDaysIcon,
  MapPinIcon,
  DocumentTextIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, MagnifyingGlassIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { RootState } from '@/lib/redux/store'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { ADMIN_LOGIN } from '@/app/admin/page-routes'
import Link from 'next/link'
import useSignOut from '@/_utils/signout'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

   const [sidebarOpen, setSidebarOpen] = useState(false)
   const user = useSelector((state: RootState) => state.user)
   const [authAdminToken, setAuthAdminToken] = useState<string | null>(null)
   const router = useRouter()
   const signOut = useSignOut()

   useEffect(() => {

      if (typeof window !== 'undefined') {
         const token = localStorage.getItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY as string) || null
         setAuthAdminToken(token)
   
         if (!token || token == '') {
            router.push(ADMIN_LOGIN)
            return
         }
      }

   }, [])
   
   const navigation = [
      { name: 'Dashboard', icon: HomeIcon, href: '#', current: true },
      {
        name: 'Bookings',
        icon: CalendarDaysIcon,
        current: false,
        children: [
          { name: 'All Bookings', href: '/admin/bookings/all' },
          { name: 'Add Manual Booking', href: '/admin/bookings/add' }
        ],
      },
      { name: 'Manage Users', icon: UsersIcon, href: '/admin/users/all', current: false },
      {
         name: 'Cars',
         icon: CalendarDaysIcon,
         current: false,
         children: [
           { name: 'All cars', href: '/admin/cars/all' },
           { name: 'Add Car', href: '/admin/cars/add' }
         ],
      },
      { name: 'Master Locations', icon: MapPinIcon, href: '/admin/locations/all', current: false },
      {
        name: 'CMS',
        icon: DocumentTextIcon,
        current: false,
        children: [
            { name: 'Home page', href: '/admin/cms/home' },
            { name: 'About Us', href: '/admin/cms/about' },
            { name: 'Contact Us', href: '/admin/cms/contact' },
            { name: 'Privacy Policy', href: '/admin/cms/privacy' },
            { name: 'Terms and Conditions', href: '/admin/cms/terms' },
        ],
      },
      {
         name: 'Suppliers',
         icon: CalendarDaysIcon,
         current: false,
         children: [
           { name: 'All suppliers', href: '/admin/suppliers/all' },
           { name: 'Add supplier', href: '/admin/suppliers/add' }
         ],
      },
   ]

   const userNavigation = [
      { id: 'profile', name: 'Your profile' },
      { id: 'signout', name: 'Sign out' },
   ]
   
   const classNames = (...classes: any) => {
      return classes.filter(Boolean).join(' ')
   }

   const handleUserNavigation = (id: string) => {

      if (id == 'signout') {
         signOut()
      } else if (id == 'profile') {
         
      }
   }
    
   return (
      authAdminToken && (
         <div>
            <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
               <DialogBackdrop transition className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0" />
               <div className="fixed inset-0 flex">
                  <DialogPanel transition className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full">
                     <TransitionChild>
                        <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                        <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                           <span className="sr-only">Close sidebar</span>
                           <XMarkIcon aria-hidden="true" className="h-6 w-6 text-white" />
                        </button>
                        </div>
                     </TransitionChild>
                  
                     <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
                        <div className="flex h-16 shrink-0 items-center">
                           <img alt="Your Company" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500" className="h-8 w-auto" />
                        </div>
                        <nav className="flex flex-1 flex-col">
                           <ul role="list" className="flex flex-1 flex-col gap-y-7">
                              <li>
                                 <ul role="list" className="-mx-2 space-y-1">
                                 {navigation.map((item) => (
                                    <li key={item.name}>
                                       {!item.children ? (
                                       <Link
                                          href={item.href}
                                          className={classNames(
                                          item.current
                                             ? 'bg-gray-800 text-white'
                                             : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                          'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                                          )}
                                       >
                                          <item.icon aria-hidden="true" className="h-6 w-6 shrink-0 text-gray-400" />
                                          {item.name}
                                       </Link>
                                       ) : (
                                       <Disclosure as="div">
                                          <DisclosureButton
                                             className={classNames(
                                                item.current
                                                   ? 'bg-gray-800 text-white'
                                                   : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                                'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 w-full',
                                             )}
                                          >
                                             <item.icon aria-hidden="true" className="h-6 w-6 shrink-0 text-gray-400" />
                                             {item.name}
                                             <ChevronRightIcon aria-hidden="true" className="ml-auto h-5 w-5 shrink-0 text-gray-400 group-data-[open]:rotate-90 group-data-[open]:text-gray-500" />
                                          </DisclosureButton>
                                          <DisclosurePanel as="ul" className="mt-1 px-2">
                                             {item.children.map((subItem: any) => (
                                             <li key={subItem.name}>
                                                <DisclosureButton
                                                   as="a"
                                                   href={subItem.href}
                                                   className={classNames(
                                                   subItem.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                                   'block rounded-md py-2 pl-9 pr-2 text-sm leading-6',
                                                   )}
                                                >
                                                   {subItem.name}
                                                </DisclosureButton>
                                             </li>
                                             ))}
                                          </DisclosurePanel>
                                       </Disclosure>
                                       )}
                                    </li>
                                 ))}
                                 </ul>
                              </li>
                           </ul>
                        </nav>
                     </div>
                  </DialogPanel>
               </div>
            </Dialog>

            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
               <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center">
                     <img alt="Your Company" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500" className="h-8 w-auto" />
                  </div>
                  <nav className="flex flex-1 flex-col">
                     <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                           <ul role="list" className="-mx-2 space-y-1">
                           {navigation.map((item) => (
                              <li key={item.name}>
                                 {!item.children ? (
                                 <Link
                                    href={item.href}
                                    className={classNames(
                                    item.current
                                       ? 'bg-gray-800 text-white'
                                       : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                    'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                                    )}
                                 >
                                    <item.icon aria-hidden="true" className="h-6 w-6 shrink-0 text-gray-400" />
                                    {item.name}
                                 </Link>
                                 ) : (
                                 <Disclosure as="div">
                                    <DisclosureButton
                                       className={classNames(
                                          item.current
                                             ? 'bg-gray-800 text-white'
                                             : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                          'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 w-full',
                                       )}
                                    >
                                       <item.icon aria-hidden="true" className="h-6 w-6 shrink-0 text-gray-400" />
                                       {item.name}
                                       <ChevronRightIcon aria-hidden="true" className="ml-auto h-5 w-5 shrink-0 text-gray-400 group-data-[open]:rotate-90 group-data-[open]:text-gray-500" />
                                    </DisclosureButton>
                                    <DisclosurePanel as="ul" className="mt-1 px-2">
                                       {item.children.map((subItem: any) => (
                                       <li key={subItem.name}>
                                          <DisclosureButton
                                             as="a"
                                             href={subItem.href}
                                             className={classNames(
                                             subItem.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                             'block rounded-md py-2 pl-9 pr-2 text-sm leading-6',
                                             )}
                                          >
                                             {subItem.name}
                                          </DisclosureButton>
                                       </li>
                                       ))}
                                    </DisclosurePanel>
                                 </Disclosure>
                                 )}
                              </li>
                           ))}
                           </ul>
                        </li>
                     </ul>
                  </nav>
               </div>
            </div>

            <div className="lg:pl-72">
               <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                  <button type="button" onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-gray-700 lg:hidden">
                     <span className="sr-only">Open sidebar</span>
                     <Bars3Icon aria-hidden="true" className="h-6 w-6" />
                  </button>

                  {/* Separator */}
                  <div aria-hidden="true" className="h-6 w-px bg-gray-900/10 lg:hidden" />

                  <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                  <form action="#" method="GET" className="relative flex flex-1">
                     <label htmlFor="search-field" className="sr-only"> Search </label>
                     <MagnifyingGlassIcon aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400" />
                     <input id="search-field" name="search" type="search" placeholder="Search..." className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm" />
                  </form>
                  <div className="flex items-center gap-x-4 lg:gap-x-6">
                     <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                        <span className="sr-only">View notifications</span>
                        <BellIcon aria-hidden="true" className="h-6 w-6" />
                     </button>

                     {/* Separator */}
                     <div aria-hidden="true" className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" />

                     {/* Profile dropdown */}
                     <Menu as="div" className="relative">
                        <MenuButton className="-m-1.5 flex items-center p-1.5">
                           <span className="sr-only">Open user menu</span>
                           <img alt="" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" className="h-8 w-8 rounded-full bg-gray-50" />
                           <span className="hidden lg:flex lg:items-center">
                              <span aria-hidden="true" className="ml-4 text-sm font-semibold leading-6 text-gray-900">
                                 {user.first_name} {user.last_name}
                              </span>
                              <ChevronDownIcon aria-hidden="true" className="ml-2 h-5 w-5 text-gray-400" />
                           </span>
                        </MenuButton>
                        <MenuItems transition className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
                        {userNavigation.map((item) => (
                           <MenuItem key={item.name}>
                              <div onClick={() => handleUserNavigation(item.id)} className="w-full cursor-pointer px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50">
                                 {item.name}
                              </div>
                           </MenuItem>
                        ))}
                        </MenuItems>
                     </Menu>
                  </div>
                  </div>
               </div>

               <main className="py-10">
                  <div className="px-4 sm:px-6 lg:px-8">{children}</div>
               </main>
            </div>
         </div>
      )
   )
}
 