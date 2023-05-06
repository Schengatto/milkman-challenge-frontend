import { FunctionComponent, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Card from "shared/components/ui/Card";
import PageTitle from "shared/components/PageTitle";
import { Order } from "features/orders-management/models/order";
import ordersService from "features/orders-management/services/orders-service";
import OrderForm from "features/orders-management/components/form/OrderForm";

const Component = styled.div`
    margin: 1rem;
`;

const OrderCreate: FunctionComponent = () => {
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const navigate = useNavigate();
    const handleCancel = () => {
        navigate("/order");
    };

    const handleCreateOrder = async (order: Order) => {
        if (isSaving) return;

        setIsSaving(true);
        await ordersService.addOrder(order).finally(() => setIsSaving(false));
        handleCancel();
    };

    const pageTitle = (<PageTitle title="Create Order" />);

    return (
        <Component>
            <Card header={pageTitle}>
                <OrderForm
                    readonly={isSaving}
                    onCancel={handleCancel}
                    onSubmit={handleCreateOrder} />
            </Card>
        </Component>
    );
};

export default OrderCreate;