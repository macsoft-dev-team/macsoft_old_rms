import { ButtonGroup } from "react-bootstrap";
import Pagination from "../../components/pagination";
import SearchForm from "../../components/SearchForm";
import ReusableTable from "../../components/Table";
import useUsers from "../../lib/hooks/user";
import { AddBtn, UploadBtn } from "../../components/common-components";
import UserEditForm from "./UserEditForm";

export default function Users() {
    // Temporary mock data for demonstration
   const { users, loading, currentPage, totalPages,fetchUser, handleSearch, handleClear,setEdit ,setCreate} = useUsers();
    const transFormdata = (data) => {
        return data.map((item) => ({
            ...item,
            createdAt: new Date(item.createdAt).toLocaleString(),
            status: item.status ? 'Active' : 'Inactive',
        }));
    };
    const handleCreate = () => {
        console.log("Create User");
        setCreate(true);
    }
    const handleUpload = () => {
        console.log("Upload Users");
    };
    const handleEdit = (user) => {
        fetchUser(user.id);
        setEdit(true);
        console.log("Edit User:", user);
    };
    return (
        <section className="d-flex flex-column">
            <header className="d-lg-flex align-items-center justify-content-between mb-1">
                <h5 className="text-uppercase">Users</h5>
                <div className="d-flex gap-2">
                    <SearchForm onSubmit={handleSearch} onClear={handleClear} />
                    <ButtonGroup>
                        <AddBtn onClick={handleCreate} />
                        {/* <UploadBtn onClick={handleUpload} />
                         <ExportExcelBtn /> */}
                    </ButtonGroup>
                </div>
            </header>
            <ReusableTable
                headerColor="#007bff"
                headerTextColor="#fff"
                loading={loading}
                onRowClick={(row) => handleEdit(row)}
                SNo={true}
                currentPage={currentPage}
                pageSize={totalPages}
                columns={[
                    { key: 'name', label: 'Name', width: 200, align: 'start', textWrap: 'nowrap' },
                    { key: 'email', label: 'Email', width: 250, align: 'start', textWrap: 'nowrap' },
                    { key: 'phone', label: 'Phone', width: 150, align: 'start', textWrap: 'nowrap' },
                    { key: 'createdAt', label: 'Registered At', width: 150, align: 'start', textWrap: 'nowrap' },
                    { key: 'status', label: 'Status', width: 100, align: 'start', textWrap: 'nowrap' },
                ]}
                data={users ? transFormdata(users) : []}
            />
            <div className="ms-auto">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => console.log("Change to page:", page)}
                />
            </div>
            <UserEditForm />
        </section>
    );
}
