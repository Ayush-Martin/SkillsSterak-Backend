import { IAssignment } from "../../models/Assignment.model";

export interface IAssignmentService {
  createAssignment: (
    title: string,
    description: string,
    task: string,
    courseId: string
  ) => Promise<IAssignment>;
  editAssignment: (
    assignmentId: string,
    title: string,
    description: string,
    task: string
  ) => Promise<IAssignment | null>;
  deleteAssignment: (assignmentId: string) => Promise<void>;
  getCourseAssignments: (courseId: string) => Promise<IAssignment[]>;
  getUserAssignments: (
    userId: string,
    courseId: string
  ) => Promise<IAssignment[]>;
  //   getAssignments: (data: any) => Promise<any>;
  //   getAssignment: (data: any) => Promise<any>;
  //   updateAssignment: (data: any) => Promise<any>;
  //   deleteAssignment: (data: any) => Promise<any>;
}
