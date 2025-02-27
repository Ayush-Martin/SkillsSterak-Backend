import { ICourse } from "../../models/Course.model";
import BaseRepository from "../../repositories/Base.repository";

export interface ICourseRepository extends BaseRepository<ICourse> {
    findCourseByTitle(title:string):Promise<ICourse | null>
}
