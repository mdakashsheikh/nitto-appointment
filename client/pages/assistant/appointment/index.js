import { format } from 'date-fns';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from "primereact/checkbox";
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { ProductService } from '../../../demo/service/ProductService';

import { getJWT, getUserName } from '../../../utils/utils';

const Appointment = () => {
    let emptyProduct = {
        id: null,
        date1:'',
        doctor: '',
        specialist: '',
        serial: '',
        name: '',
        phone:'',
        age: '',
        gender:'',
        time1:'',
        chamber: '',
        category: null,
        price: 0,
        details: '',
        status: ''
    };


    let emptyFollo = {
        id: null,
        visit_status: false,
        price: '',
        followUpDate: '',
        visit_time:'',
        image: '',
    }

    const [products, setProducts] = useState(null);
    const [masterChamber, setMasterChamber] = useState(null);
    const [masterSpecialist, setMasterSpecialist] = useState(null);
    const [masterDoctor, setMasterDoctor] = useState(null);
    const [masterTime, setMasterTime] = useState(null);
    const [masterAvailable, setMasterAvailable] = useState(null);
    const [timeHook, setTimeHook] = useState(null)
    const [checkSpecial, setCheckSpecial] = useState(null);
    const [checkDoctor, setCheckDoctor] = useState(null);
    const [checkChamber, setCheckChamber] = useState(null);
    const [msAvailable, setMsAvailable] = useState(null);
    const [masterOperator, setMasterOperator] = useState(null);
    const [followData, setFollowData] = useState(null);
    const [checked, setChecked] = useState(false);
    const [file, setFile] = useState([]);
    const [jwtUser, setJWTUser] = useState(null);

    const [productDialog, setProductDialog] = useState(false);

    const [followDialog, setFolloDialog] = useState(false);
    const [follow, setFollow] = useState(emptyFollo);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [light, setLight] = useState(0);
    const [toggleRefresh, setTogleRefresh] = useState(false);
    const [jwtToken, setJwtToken] = useState(null);
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState('center');
    const [sCheck, setSCheck] = useState(null);
    const [dateHo, setDateHo] = useState(null);

    const timeObj = [];

    useEffect(() => {
        const jwtToken = getJWT();
        const user = getUserName();

        if(!jwtToken) {
            return window.location = '/'
        }

        setJwtToken(jwtToken);
        setJWTUser(user)
    }, [])


    useEffect(() => {
        if(!jwtToken) {
            return;
        }

        ProductService.getProducts().then((data) => setProducts(data));
        ProductService.getChamber().then((data) => setMasterChamber(data));
        ProductService.getSpecialist().then((data) => setMasterSpecialist(data));
        ProductService.getDoctor().then((data) => setMasterDoctor(data));
        ProductService.getTime().then((data) => setMasterTime(data));
        ProductService.getFollow().then((data) => setFollowData(data));
        ProductService.getOperator().then((data) => setMasterOperator(data));
        ProductService.getAvailable().then((data) => {
            setMsAvailable(data)
            setMasterAvailable(data);
        });
    }, [ jwtToken, toggleRefresh]);

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
        setSCheck(1)
    };

    const openFollow = (product) => {
        setFollow({
            ...emptyFollo,  
            pid: product._id,
            pchamber: product.chamber,
            pspecialist: product.specialist,
            pdoctor: product.doctor,
            ptime1: product.time1,
            pdate1: product.date1,
            pname: product.name,
            pphone: product.phone,
            pserial: product.serial,
        });
        setChecked(false)
        setCheckChamber(product.chamber);
        setCheckDoctor(product.doctor);
        setCheckSpecial(product.specialist) 
        setProduct({...product});
        setSubmitted(false);
        setFolloDialog(true)
    }

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideFollowDialog = () => {
        setSubmitted(false);
        setFolloDialog(false);
    };

    follow.visit_status = checked;
  

    const saveProduct = (type) => {
        setSubmitted(true);

        console.log({type, follow, product,}, "TEST")

        console.log(type, "TYPE", product, "PRODUCT", follow, "FOLLOW")


        if(type == 'product' && product.chamber && product.specialist && product.doctor && product.date1 && product.time1 && product.name && product.age && product.gender && product.phone && product.serial && product._id) {
            console.log("Edit-----Patient")

            ProductService.editPatient(
                product.chamber,
                product.specialist,
                product.doctor,
                product.date1,
                product.time1,
                product.name,
                product.age,
                product.gender,
                product.phone,
                product.serial,
                product._id,
                product.details,
            ).then(() => {
                setTogleRefresh(!toggleRefresh);
                setProductDialog(false);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Patient is Updated', life: 3000 });
            })
        } else if(type == 'product' && product._id == undefined && product.chamber && product.doctor && product.date1 && product.time1 && product.name) {
            console.log("Create-----Patient")
            ProductService.postPatient(
                product.chamber,
                product.specialist,
                product.doctor,
                product.date1,
                product.time1,
                product.name,
                product.age,
                product.gender,
                product.phone,
                product.details,
                product.serial,
                product.status,
            ).then(() => {
                setTogleRefresh(!toggleRefresh);
                setProductDialog(false);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Patient is Created', life: 3000, position:"top-center" });
            })
        } else if(type == 'follow' && type == 'product' && follow.pchamber , follow.pspecialist, follow.pdoctor, follow.pdate1, follow.ptime1, follow.pname, follow.pphone, follow.pserial, follow.pid && follow.visit_status && follow.price && follow.followUpDate && follow.visit_time, product._id ) {
            console.log(product);

            console.log(product._id)

            ProductService.editPatientFollow(
                product._id,
            ).then(() => {
                setFolloDialog(false)
            })

            ProductService.postFollow(
                follow.pchamber,
                follow.pspecialist,
                follow.pdoctor,
                follow.pdate1,
                follow.ptime1,
                follow.pname,
                follow.pphone,
                follow.serial,
                follow.pid,
                follow.visit_status,
                follow.price,
                follow.followUpDate,
                follow.visit_time,
                file,
            ).then(() => {
                setTogleRefresh(!toggleRefresh);
                setFolloDialog(false);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Follow Up Date is Created', life: 3000 });
            })
        } else if(type == "follow" &&  follow.price && follow.followUpDate && follow.visit_time && follow._id) {
            console.log("EDIT-FOLLOW");
            ProductService.editFollow(
                follow.price,
                follow.followUpDate,
                follow.time1,
                follow._id,
            ).then(() => {
                setTogleRefresh(!toggleRefresh);
                setFolloDialog(false);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Follow Up Date is Updated', life: 3000 });
            })
        }
    }; 

    const filterData = masterOperator?.filter(item => item.userName == jwtUser);
    const Doctor = filterData?.map(item => item.dr_name).toString();

    const filterProducts = products?.filter(item => item.doctor == Doctor)


    const editProduct = (product) => {
        console.log("EDIT", product);
        setProduct({ ...product });
        setProductDialog(true);
        setSCheck(0);
    };

    const editFollow = (follow) => {
        setFollow({...follow});
        setChecked(follow.visit_status);
        setFolloDialog(true);
        setCheckChamber(follow.chamber);
        setCheckDoctor(follow.doctor);
        setCheckSpecial(follow.specialist) 

    }

    const deleteProduct = () => {
        let _products = products.filter((val) => val.id !== product.id);
        setProducts(_products);
        setFolloDialog(false);
        setProduct(emptyProduct);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const footerContent = (
        <div>
            <Button label="Cancel" icon="pi pi-check" onClick={() => setVisible(false)} autoFocus />
        </div>
    );

    const show = (position) => {
        setPosition(position);
        setVisible(true);
    };

    const onFollowChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _follow = {...follow};
        _follow[`${name}`] = val;

        setFollow(_follow);
    }

    const onCheckChange = (e, name) => {
        let _follow = {...follow};
        _follow[`${name}`] = e.checked;
        
        setFollow(_follow);
    }

    const onFollowDateChange = (e, name) => {
        let _product = {...follow };
        _product[`${name}`] = e.value;
        setFollow(_product);
        // setProduct(_product);

        const test = e.value.toString();
        setTimeHook(test.slice(0, 3));
    }


    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const onSelectionChange = (e, name) => {
        let _product = {...product };
        _product[`${name}`] = e.value;
        setProduct(_product);
    }

    const onDateChange = (e, name) => {
        let _product = {...product };
        _product[`${name}`] = e.value;
        setProduct(_product);

        const test = e.value.toString();
        setTimeHook(test.slice(0, 3));
        setDateHo(e.value);

        console.log('selectionDate: ', 'name', test, 'typeOf', typeof e.value, 'selection', e.value, 'product', _product)
    }


    const masterChamberFiltered = masterAvailable?.filter((item) => item.dname == Doctor);    
    const chamberList = masterChamberFiltered?.map((item) => {
        return {  label: item.chamber, value: item.chamber }
    })

    const masterSpecialistFiltered = masterDoctor?.filter((item) => item.is_active == '1' && item.name == Doctor); 
    const specialistList = masterSpecialistFiltered?.map((item) => {
        return { label: item.specialist, value: item.specialist }
    })

    const doctorList = [
        { label: Doctor, value: Doctor},
        
    ];



    const timeFiltered = masterAvailable?.filter(item => item.dname == Doctor);
     const mapTime = timeFiltered?.map(item => {
        timeObj.Sat = item.saturdayT;
        timeObj.Sun = item.sundayT;
        timeObj.Mon = item.mondayT;
        timeObj.Tue = item.tuesdayT;
        timeObj.Wed = item.wednesdayT;
        timeObj.Thu = item.thursdayT;
        timeObj.Fri = item.fridayT;
     })


    let timeList = [];
    if(timeHook == 'Sat') {
       timeList = [
           {label: [`${timeObj.Sat}`], value: `${timeObj.Sat}`}
       ]
    } else if(timeHook == 'Sun') {
       timeList = [
           {label: [`${timeObj.Sun}`], value: `${timeObj.Sun}`}
       ]
    }else if(timeHook == 'Mon') {
       timeList = [
           {label: [`${timeObj.Mon}`], value: `${timeObj.Mon}`}
       ]
    }else if(timeHook == 'Tue') {
       timeList = [
           {label: [`${timeObj.Tue}`], value: `${timeObj.Tue}`}
       ]
    }else if(timeHook == 'Wed') {
       timeList = [
           {label: [`${timeObj.Wed}`], value: `${timeObj.Wed}`}
       ]
    }else if(timeHook == 'Thu') {
       timeList = [
           {label: [`${timeObj.Thu}`], value: `${timeObj.Thu}`}
       ]
    }else if(timeHook == 'Fri') {
       timeList = [
           {label: [`${timeObj.Fri}`], value: `${timeObj.Fri}`}
       ]
    }

    const genderList = [
        { label: 'Male', value: 'male'},
        { label: 'Female', value: 'female'},
    ];

    let stDate;
    let serialDate = null;
    let filSerial = null;



    let msSerila = 0;
    let ans = null;
    if(light == 1) {
        msSerila = msAvailable?.map(item => item.serial-0);
        msSerila = Math.max(...msSerila);

    } else if(masterAvailable != undefined){
        let copySerial = masterAvailable?.filter(item => (item.chamber == product.chamber) && (item.dname == product.doctor));
        msSerila = copySerial?.map(item => item.serial-0);
    }

    const numArr = Array.from({ length: msSerila}, (_, index) => index + 1);

    if(sCheck == 0) {
        stDate = products?.filter(item => item.date1 == product.date1);
        serialDate = stDate.map(item => item.serial);
        filSerial = serialDate?.filter(item => item != undefined);
        ans = numArr?.filter(item => !filSerial.includes(item.toString()))
        console.log("ZERO")

    } else if(sCheck == 1) {
        let date2 = format(new Date(dateHo), 'yyyy-MM-dd');
        stDate = products?.filter(item => item.date1.slice(0, 10) == date2);
        serialDate = stDate.map(item => item.serial);
        filSerial = serialDate?.filter(item => item != undefined);
        ans = numArr?.filter(item => !filSerial.includes(item.toString()))
    }
    
    if(!ans) {
        ans = numArr;
    }
    

    const serialList = ans.map(item => {
        
        return {label: item, value: item}
    })


    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button
                    label="Add Appointment"
                    icon="pi pi-plus"
                    severity="sucess"
                    className="mr-2"
                    onClick={openNew}
                />
                <Button
                    label="Download list"
                    icon="pi pi-download"
                    severity="help"
                    onClick={exportCSV}
                />
            </React.Fragment>
        );
    };


    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const phoneBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Phone</span>
                {rowData.phone}
            </>
        );
    }

    const appointDateBodyTemplete = (rowData) => {
        return (
            <>
                <span className="p-column-title">Appointment Date</span>
                   {rowData.date1.slice(0, 10)}
                
            </>
        );
    }


    const serialBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Serial Number</span>
                {rowData.serial}
            </>
        );
    }

    const problemBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Problem</span>
                {rowData.details}
            </>
        );
    }

    const chamberBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Chamber</span>
                {rowData.chamber}
            </>
        );
    }

    const dateBodyTemplete = () => {
        return (
            <>
                <span className="p-column-title">Date</span>
                {rowData.date1}
            </>
        )
    }

    const timeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Time</span>
                {rowData.time1}
            </>
        );
    }
    
    const genderBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Gender</span>
                {rowData.gender}
            </>
        );
    }


    const statusBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={`product-badge status-${rowData.status}`} >{rowData.status}</span>
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        if(rowData.visit_status == true && rowData.status == "Updated") {
            return (
                <>
                    <Button icon="pi pi-eye" severity="success" rounded className="mr-2" onClick={() => editProduct(rowData)} />
                    <Button icon="pi pi-pencil" severity="success" rounded onClick={() => {
                        let data1 = followData?.filter(item=> item.patient_id == rowData._id);
                        if (data1.length > 0) {
                            editFollow(data1[0]);
                        }
                    }} 
                    />
                </>
            );
        } else if(rowData.serial && !rowData.visit_status) {
            return (
                <>
                    <Button icon="pi pi-eye" severity="success" rounded className="mr-2" onClick={() => editProduct(rowData)} />
                    <Button icon="pi pi-pencil" severity="warning" rounded onClick={() => openFollow(rowData)} />
                </>
            );
        } 
        else {
            return (
                <>
                    <Button icon="pi pi-eye" severity="warning" rounded className="mr-2" onClick={() => editProduct(rowData)} />
                    <Button icon="pi pi-pencil" severity="warning" rounded className="mr-2" onClick={() => show('top')}  />
                </>
            );
        }
        
    };


    const topHeader = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                <h2 className="m-0">Appointment List</h2>
                </div>
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={() => saveProduct('product')} />
        </>
    );
    const followDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideFollowDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={ () => saveProduct('follow')} />
        </>
    );
    
    
    if(products == null) {
        return (
            <div className="card">
                <div className="border-round border-1 surface-border p-4 surface-card">
                    <div className="flex mb-3">
                        <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                        <div>
                            <Skeleton width="10rem" className="mb-2"></Skeleton>
                            <Skeleton width="5rem" className="mb-2"></Skeleton>
                            <Skeleton height=".5rem"></Skeleton>
                        </div>
                    </div>
                    <Skeleton width="100%" height="570px"></Skeleton>
                    <div className="flex justify-content-between mt-3">
                        <Skeleton width="4rem" height="2rem"></Skeleton>
                        <Skeleton width="4rem" height="2rem"></Skeleton>
                    </div>
                </div>
            </div>
        )
    }

    const chamberAuto = chamberList?.map(item => item.label).toString();
    const specialistAuto = specialistList?.map(item => item.label).toString();
    const timeAuto = timeList?.map(item => item.label).toString();

    console.log('timeAuto', timeAuto)


    console.log({product, Doctor, chamberAuto, specialistAuto})
    if (!product.chamber && !product.doctor && !product.specialist && chamberAuto) {

        product.doctor = Doctor
        product.chamber = chamberAuto
        product.specialist = specialistAuto
    
    }

    if(timeAuto){
        product.time1 = timeAuto
    }


    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar
                        className="mb-4"
                        left={topHeader}
                        right={rightToolbarTemplate}
                    ></Toolbar>

                    <DataTable
                        ref={dt}
                        value={filterProducts}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"
                        paginator
                        rows={13}
                        rowsPerPageOptions={[5, 10, 25, 50, 100]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} out of {totalRecords} Patients"
                        globalFilter={globalFilter}
                        emptyMessage="Not found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column
                            field="date1"
                            header="Appointment Date"
                            sortable
                            body={appointDateBodyTemplete}
                            headerStyle={{ minWidth: "2rem" }}
                        ></Column>
                        <Column
                            field="serial"
                            header="Serial Number"
                            body={serialBodyTemplate}
                        ></Column>
                        <Column
                            field="name"
                            header="Name"
                            sortable
                            body={nameBodyTemplate}
                            headerStyle={{ minWidth: "2rem" }}
                        ></Column>
                        <Column
                            field="phone"
                            header="Phone"
                            body={phoneBodyTemplate}
                        ></Column>
                        <Column
                            field="gender"
                            header="Gender"
                            sortable
                            body={genderBodyTemplate}
                            headerStyle={{ minWidth: "3rem" }}
                        ></Column>
                        <Column
                            field="time1"
                            header="Time"
                            body={timeBodyTemplate}
                            headerStyle={{ minWidth: "3rem" }}
                        ></Column>
                        <Column
                            field="chamber"
                            header="Chamber"
                            sortable
                            body={chamberBodyTemplate}
                            headerStyle={{ minWidth: "2rem" }}
                        ></Column>
                        <Column
                            field="details"
                            header="Problem"
                            body={problemBodyTemplate}
                            headerStyle={{ minWidth: "2rem" }}
                        ></Column>
                        <Column
                            field="status"
                            header="Status"
                            body={statusBodyTemplate}
                            sortable
                            headerStyle={{ minWidth: "2rem" }}
                        ></Column>
                        <Column
                            header="Action"
                            body={actionBodyTemplate}
                            headerStyle={{ minWidth: "2rem" }}
                        ></Column>
                    </DataTable>

                    <Dialog header="Warning" visible={visible} position='top' style={{ width: '30vw' }} onHide={() => setVisible(false)} footer={footerContent}  >
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '4rem' }} />
                        <span>
                            Please Updated Patient Serial Number
                        </span>
                    </Dialog>

                    <Dialog
                        visible={productDialog}
                        style={{ width: "600px" }}
                        header="Patient Details"
                        modal
                        className="p-fluid"
                        footer={productDialogFooter}
                        onHide={hideDialog}
                    >

                    
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="chamber">Chamber</label>
                                <Dropdown
                                    value={product.chamber}
                                    name='chamber'
                                    onChange={(e) => onSelectionChange(e, "chamber")}
                                    options={chamberList}
                                    optionLabel="value"
                                    showClear
                                    placeholder="Select a Chamber"
                                    required
                                    autoFocus
                                    className={classNames({
                                        "p-invalid": submitted && !product.chamber,
                                    })}
                                />
                                </div>
                                {submitted && !product.chamber && (
                                    <small className="p-invalid">
                                        Chamber is required.
                                    </small>
                                )}
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="specialist">Specialization</label>
                                <Dropdown
                                    value={product.specialist}
                                    name='specialist'
                                    onChange={(e) => onSelectionChange(e, "specialist")}
                                    options={specialistList}
                                    optionLabel="label"
                                    showClear
                                    placeholder="Select a Specialization"
                                    required
                                    className={classNames({
                                        "p-invalid": submitted && !product.specialist,
                                    })}
                                />
                                {submitted && !product.chamber && (
                                    <small className="p-invalid">
                                        Specialization is required.
                                    </small>
                                )}
                            </div>
                            <div className="field col">
                                <label htmlFor="doctor">Doctor</label>
                                <Dropdown
                                    value={product.doctor}
                                    name='doctor'
                                    onChange={(e) => onSelectionChange(e, "doctor")}
                                    options={doctorList}
                                    optionLabel="label"
                                    showClear
                                    placeholder="Select a Doctor"
                                    required
                                    className={classNames({
                                        "p-invalid": submitted && !product.doctor,
                                    })}
                                />
                                {submitted && !product.chamber && (
                                    <small className="p-invalid">
                                        Doctor is required.
                                    </small>
                                )}
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="date1">Date</label>
                                <Calendar 
                                    value={new Date(product.date1)}
                                    name='date1' 
                                    onChange={(e) => onDateChange(e, "date1")} 
                                    dateFormat="dd/mm/yy" 
                                    placeholder="Select a Date"
                                    required
                                    showIcon
                                    className={classNames({
                                        "p-invalid": submitted && !product.date1,
                                    })}
                                />
                                {submitted && !product.date1 && (
                                    <small className="p-invalid">
                                        Date is required.
                                    </small>
                                )}
                            </div>
                            <div className="field col">
                                <label htmlFor="time1">Time</label>
                                <Dropdown
                                    value={product.time1}
                                    name='time1'
                                    onChange={(e) => onSelectionChange(e, "time1")}
                                    options={timeList}
                                    optionLabel="label"
                                    showClear
                                    placeholder="Select a Time"
                                    required
                                    className={classNames({
                                        "p-invalid": submitted && !product.time1,
                                    })}
                                />
                                {submitted && !product.chamber && (
                                    <small className="p-invalid">
                                        Time is required.
                                    </small>
                                )}
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="name">Name</label>
                                <InputText
                                    id="name"
                                    value={product.name}
                                    onChange={(e) => onInputChange(e, "name")}
                                    required
                                    className={classNames({
                                        "p-invalid": submitted && !product.name,
                                    })}
                                />
                                {submitted && !product.name && (
                                    <small className="p-invalid">
                                        Name is required.
                                    </small>
                                )}
                            </div>
                            <div className="field col">
                                <label htmlFor="age">Age</label>
                                <InputText
                                    id="age"
                                    value={product.age}
                                    onChange={(e) => onInputChange(e, "age")}
                                />
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="gender">Gender</label>
                                <Dropdown
                                    value={product.gender}
                                    name='gender'
                                    onChange={(e) => onSelectionChange(e, "gender")}
                                    options={genderList}
                                    optionLabel="label"
                                    showClear
                                    placeholder="Select a Gender"
                                />
                            </div>
                            <div className="field col">
                                <label htmlFor="phone">Phone</label>
                                <InputText
                                    id="phone"
                                    value={product.phone}
                                    onChange={(e) => onInputChange(e, "phone")}
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor="details">Details</label>
                            <InputTextarea
                                id="details"
                                value={product.details}
                                onChange={(e) =>
                                    onInputChange(e, "details")
                                }
                                required
                                rows={3}
                                cols={20}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="serial">Add Serial Number</label>
                            <Dropdown 
                                value={Number(product.serial)} 
                                name='serial'
                                onChange={(e) => onSelectionChange(e, "serial")} 
                                options={serialList} 
                                optionLabel="label" 
                                placeholder="Select a Serial Number" 
                                className={classNames({
                                    "p-invalid": submitted && !product.serial,
                                })}
                            />
                            {submitted && !product.serial && (
                                <small className="p-invalid">
                                    Serial Number is required.
                                </small>
                            )}
                        </div>
                    </Dialog>


                    <Dialog
                        visible={followDialog}
                        style={{ width: "550px" }}
                        header="Follow-Up-Date"
                        modal
                        className="p-fluid"
                        footer={followDialogFooter}
                        onHide={hideFollowDialog}
                    >

                        <div className="formgrid grid">
                            <div className="card flex justify-content-center gap-3">
                                    <label htmlFor="age">Visit Status</label> 
                                    <Checkbox onChange={e => setChecked(e.checked)} checked={checked}></Checkbox>
                            </div>
                            <div className="field col">
                                <label htmlFor="price">Amount</label>
                                <InputText
                                    id="price"
                                    value={(follow.price)}
                                    onChange={(e) => onFollowChange(e, "price")}
                                    placeholder='Enter  Dr. Visit Charge'
                                />
                            </div>
                        </div>
                        
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="date1">Follow Up Date</label>
                                <Calendar 
                                    value={new Date(follow.followUpDate)}
                                    name='followUpDate' 
                                    // onChange={(e) => onFollowChange(e, "followUpDate")}
                                    onChange={(e) => onFollowDateChange(e, "followUpDate")} 
                                    dateFormat="dd/mm/yy" 
                                    placeholder="Select a Date"
                                    required
                                    showIcon
                                    className={classNames({
                                        "p-invalid": submitted && !follow.followUpDate,
                                    })}
                                />
                                {submitted && !follow.followUpDate && (
                                    <small className="p-invalid">
                                        Follow Up Date is required.
                                    </small>
                                )}
                            </div>
                            
                            <div className="field col">
                                <label htmlFor="time1">Time to Visit</label>
                                <Dropdown
                                    value={follow.visit_time}
                                    name='time1'
                                    onChange={(e) => onFollowChange(e, "visit_time")}
                                    options={timeList}
                                    optionLabel="label"
                                    showClear
                                    placeholder="Select a Time"
                                    required
                                    className={classNames({
                                        "p-invalid": submitted && !follow.visit_time,
                                    })}
                                />
                                {submitted && !follow.visit_time && (
                                    <small className="p-invalid">
                                        Visit Time is required.
                                    </small>
                                )}
                            </div>
                        </div>

                        <div >
                            <FileUpload 
                                multiple 
                                accept="image/*" 
                                name='photo'
                                url='//localhost:5000/follow-image'
                                maxFileSize={1000000} 
                                emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>} 
                                onUpload={(e)=> { 
                                    
                                    console.log( "slidufgoidh", e)
                                    const data = JSON.parse(e.xhr.responseText)
                                    console.log(data)
                                    setFile([...file, ...data.file1]);
                                }}
                                onRemove={(e)=> { 
                                    console.log("remove", e)
                                }}
                            />
                        </div>
                    </Dialog>
                    
                </div>
            </div>
        </div>
    );
};

export default Appointment;