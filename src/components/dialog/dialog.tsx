import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { Button } from '../ui/button';

interface HeadLessDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    primaryButtonLabel: string;
    secondaryButtonLabel: string;
    onPrimaryButtonClick: (event?: React.MouseEvent) => void;
    onSecondaryButtonClick: (event?: React.MouseEvent) => void;
}

const HeadLessDialog: React.FC<HeadLessDialogProps> = ({ title, isOpen, onClose, message, primaryButtonLabel, secondaryButtonLabel, onPrimaryButtonClick, onSecondaryButtonClick }) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-200"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-100"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-accent p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h2"
                                    className="text-xl font-semibold  leading-6"
                                >
                                    {title}
                                </Dialog.Title>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        {message}
                                    </p>
                                </div>

                                <div className="mt-4 flex justify-end">
                                    <Button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 mr-2"
                                        onClick={onSecondaryButtonClick}
                                    >
                                        {secondaryButtonLabel}
                                    </Button>
                                    <Button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                        onClick={onPrimaryButtonClick}
                                    >
                                        {primaryButtonLabel}
                                    </Button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default HeadLessDialog