import ClientTable from '../components/ClientsTable';

function ClientsPage() {

    return (
        <div className="p-6 w-full">
            <p className="text-2xl font-bold text-gray-800 mb-6 text-left">
                Komitenti
            </p>

            <ClientTable />

        </div>
    );
}

export default ClientsPage;