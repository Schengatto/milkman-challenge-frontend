import { MOCKED_DATA_DEPOTS } from "../data/depots";
import { MOCKED_DATA_PLANS } from "../data/plans";
import { Order, OrderStatus } from "../models/order";
import { Package } from "../models/package";
import { CreatePlanParams, PlanInfo, PlanStep } from "../models/plan";
import ordersServices from "./order-service";

class PlanService {
    async createPlan(cratePlanParams: CreatePlanParams): Promise<PlanInfo> {
        const {depotId, ordersId} = cratePlanParams;
        const planId = `P${Date.now()}`;
        const orders = new Array<Order>();

        for (let id of ordersId) {
            const order = await ordersServices.getOrder(id);
            if (order) {
                orders.push(order);
                await ordersServices.updateOrder({ ...order, status: OrderStatus.PreparingForShipment, planId });
            }
        }

        const steps = new Array<PlanStep>();
        orders.forEach((order) => {
            order.packages.forEach((packageInfo: Package) => {
                steps.push({
                    orderId: order.id!,
                    packageCode: packageInfo.code,
                    location: packageInfo.destination,
                });
            });
        });

        const depot = MOCKED_DATA_DEPOTS.find((depot) => depot.id === depotId);
        steps.unshift({ location: depot!.addressInfo });
        steps.push({ location: depot!.addressInfo });

        const newPlan: PlanInfo = { id: planId, steps };
        MOCKED_DATA_PLANS.push(newPlan);

        return Promise.resolve(newPlan);
    }

    async getPlan(id: string): Promise<PlanInfo | undefined> {
        return Promise.resolve(MOCKED_DATA_PLANS.find((m) => m.id === id));
    }
}

const instance = new PlanService();
export default instance;
