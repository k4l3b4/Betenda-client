import React from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DataType } from '@/types/global';


interface ListboxProps {
  data: DataType[],
  placeholder?: string,
  className?: string,
  loading?: boolean,
  selected: DataType | null;
  setSelected: (selected: any) => void;
}


const SelectListbox: React.FC<ListboxProps> = ({ data, loading = true, placeholder = "Select an item", className, selected, setSelected }) => {
  return (
    <div>
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative">
          <Listbox.Button className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}>
            <span className={`${selected?.label ? '' : 'opacity-60'} block truncate`}>{selected?.label ?? placeholder}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronsUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={React.Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95 -translate-y-2"
            enterTo="transform opacity-100 scale-100 -translate-y-0"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100 -translate-y-0"
            leaveTo="transform opacity-0 scale-95 -translate-y-2"
          >
            <Listbox.Options className="z-50 origin-top absolute mt-1 max-h-60 w-full overflow-auto bg-foreground p-1 rounded-md text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {loading ?
                <>
                  <div className='h-16 w-full flex items-center justify-center'>
                    <p className='text-base font-medium'>Loading...</p>
                  </div>
                </>
                :
                data?.map((item, index) => (
                  <Listbox.Option
                    key={index}
                    className={({ active }) =>
                      `relative cursor-pointer rounded-md select-none py-2 pl-10 pr-4 ${active ? 'bg-background font-medium ' : ''
                      }`
                    }
                    value={item}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                            }`}
                        >
                          {item?.label}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-500">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default SelectListbox;
