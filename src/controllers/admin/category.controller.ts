import categoryModel, { ICategory } from '../../models/category.model';
import { getNextSequenceValue } from "../utils/counter.controller";

export default class CategoryController {

    public static async getcategoryList(req: any, res: any): Promise<any[] | null> {
        try {
            const filters = req || {};
            const categories = await categoryModel.find(filters).sort({_id: 1});
            if (categories.length === 0) {
                return res.status(200).json({ 
                    message: "No Category found.........!", 
                    data: {
                      data: categories
                    },
                    status: 1
                });
            } else {
                return res.status(200).json({ 
                    data: {
                      data: categories
                    },
                    status: 1 
                });
            }
        } catch (error) {
            console.error('Error in getcategoryList:', error);
            throw error;
        }
    }
    

    public static async createCategory(data: ICategory): Promise<ICategory | null> {
        try {
          const id = await getNextSequenceValue("ICategory", "id");
          const categoryData = { ...data, id };
          const newCategory = new categoryModel(categoryData);
          await newCategory.save();
          return newCategory;
        } catch (error) {
          console.error("Error creating category:", error);
          throw error;
        }
    }
      
}
