import BookModel, { IBook } from '../models/book.model';
import categoryModel from '../models/category.model';
import ResponseUtil from '../utils/ResponseUtil';
import { getNextSequenceValue } from './utils/counter.controller';
export default class BookListController {

    public static async getBookList(req: any, res: any): Promise<any[] | null> {
        try {
            const filters = req || {};
            const books = await BookModel.find(filters).sort({_id: 1}).populate({
                path: 'category', select: 'name_kh name_en -_id'
            });
            
            if (books.length === 0) {
                return res.status(200).json({ 
                    message: "No book found.........!", 
                    data: {
                      data: books
                    },
                    status: 1
                });
            } else {
                return res.status(200).json({ 
                    data: {
                      data: books
                    },
                    status: 1 
                });
            }
        } catch (error) {
            console.error('Error in getBookList:', error);
            throw error;
        }
    }
    

    public static async createBookHandler(bookData: IBook, req: any, res: any) {
        try {
        const id = await getNextSequenceValue("IBook", "id");
        const newBookData = { ...bookData, id };
        const newBook = new BookModel(newBookData);
        await newBook.save();

        return res.status(201).json({
            message: "Book created successfully",
            data: newBook,
        });
        } catch (error) {
        console.error("Error creating book:", error);
        ResponseUtil.failwithLog(req, res, 500, "Internal Server Error", "CREATE_BOOK", error);
        }
  }

    public static async getBooksByIds(bookIds: any[]) {
        return await BookModel.find({ _id: { $in: bookIds } }).select("price -_id");
    }
      
}
