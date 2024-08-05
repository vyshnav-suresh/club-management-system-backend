

export type ProjectType = {
    id : string
    title : string;
    description : string;
    images :  string[];
    signature :  string;
    languages : string[];
    role : string;
}


export type ProjectsType = ProjectType[];