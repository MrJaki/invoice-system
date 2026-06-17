import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'

function Modal({openModal, setOpenModal, Form, size, ...Data}: any) {
    return (
        <Dialog open={openModal} onClose={setOpenModal} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                        className={`
                            relative
                            w-full
                            ${!size ? "max-w-5xl" : size == "small" ? "max-w-2xl" : "max-w-3xl"}
                            transform
                            overflow-hidden
                            rounded-lg
                            bg-white
                            text-left
                            shadow-[0_0_70px_rgba(0,0,255,0.5)]
                            transition-all
                        `}
                    >
                            <div className='p-5'>
                                <Form 
                                    {...Data}
                                />
                            </div>
                            
                        
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}

export default Modal;