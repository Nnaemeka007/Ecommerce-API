
declare namespace Express{
    export interface Request{
        user: { userId: string,name:string,role:string };
    }
}