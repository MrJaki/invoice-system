import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'

function ModalEditTask({openModal, setOpenModal, Form, ...Data}: any) {
    return (
        <Dialog open={openModal} onClose={setOpenModal} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="
                            relative transform overflow-hidden rounded-lg bg-white text-left
                            shadow-[0_0_70px_rgba(0,0,255,0.5)]
                            transition-all
                            data-closed:translate-y-4 data-closed:opacity-0
                            data-enter:duration-300 data-enter:ease-out
                            data-leave:duration-200 data-leave:ease-in
                            sm:my-8 sm:w-full sm:max-w-5xl
                            data-closed:sm:translate-y-0 data-closed:sm:scale-95
                        " >
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

export default ModalEditTask;