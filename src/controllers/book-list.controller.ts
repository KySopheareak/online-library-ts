import BookModel, { IBook } from '../models/book.model';
import ResponseUtil from '../utils/ResponseUtil';

export default class BookListController {

    public static async getBookList(req: any, res: any): Promise<any[] | null> {
        try {
            const filters = req || {};
            const books = await BookModel.find(filters)
                .sort({ _id: 1 })
                .populate({ path: 'category', select: 'name_kh name_en -_id' })
                .populate({ path: 'file', select: 'filename originalname buffer _id' });

            if (books.length === 0) {
                return res.status(200).json({ 
                    message: "No book found.........!", 
                    data: { data: books },
                    status: 1
                });
            } else {
                return res.status(200).json({ 
                    data: { data: books },
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
            const newBook = new BookModel(bookData);
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
}