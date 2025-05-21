import orderModel, { IOrder } from '../../models/order.model';
export default class OrderController {

    public static async getOrderList(req: any): Promise<IOrder[] | null> {
        try {
            const filters = req || {};
            const orders = await orderModel.find(filters)
                .populate({ path: 'books.book', select: 'title price author' })
                .populate({ path: 'customer', select: 'name address' });
            if (orders.length === 0) return null;
            return orders;
        } catch (error) {
            console.error('Error in getorderlist:', error);
            throw error;
        }
    }
    

    public static async createOrder(data: IOrder): Promise<IOrder | null> {
        try {
          const newOrder = new orderModel(data); 
          await newOrder.save(); 
          return newOrder;
        } catch (error) {
          console.error('Error creating order:', error);
          throw error;
        }
    }
      
}
