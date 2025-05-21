import CustomerModel, { ICustomer } from '../../models/customer.model';
export default class CustomerController {

    public static async getCustomerList(req: any): Promise<any[] | null> {
        try {
            const filters = req || {};
            const customers = await CustomerModel.find(filters).sort({_id: 1});
            if (customers.length === 0) return null;
            return customers;
        } catch (error) {
            console.error('Error Fetching:', error);
            throw error;
        }
    }
    

    public static async createCustomer(data: ICustomer): Promise<ICustomer | null> {
        try {
          const customer = new CustomerModel(data); 
          await customer.save(); 
          return customer;
        } catch (error) {
          console.error('Error creating Customer:', error);
          throw error;
        }
    }
      
}
