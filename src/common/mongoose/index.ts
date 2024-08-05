import { Model, QueryOptions } from "mongoose";
import { getPaginationParams } from "../response";
import { toCamelCase } from "..";


export type PopulateType = {
    path: string;
    select?: string | string[] | object;
    model?: Model<any>;
    match?: any;
    options?: QueryOptions;
  };
  

type paginationQueryBuilderProps = {
    _model: Model<any>;
    select: string | object;
    likeSearch?: string;
    query: any;
  
    where?: any;
    mediaLoop?: boolean;
    extraLoop?: boolean;
    extraLoopKey?: string;
    populate?: PopulateType[];
  };

  const splitselect = (select: string) => {
    let objects: any = {};
    for (const iterator of select.split(" ").filter((e) => e)) {
      if (iterator.includes(":")) {
        const splitData = iterator.split(":");
        objects[splitData[1]] = "$" + splitData[0];
      } else {
        objects[iterator] = 1;
      }
    }
    return objects;
  };

  export const extractSelect = (select: string | string[] | object) => {
    if (!select) {
      return {};
    }
  
    let objects: any = {};
    objects["id"] = "$_id";
    if (Array.isArray(select)) {
      for (const iterator of select) {
        objects = Object.assign({}, objects, splitselect(iterator));
      }
    } else if (typeof select === "object") {
      return select;
    } else {
      objects = Object.assign({}, objects, splitselect(select));
    }
    // for (const iterator of select.split(" ").filter((e) => e)) {
    //   if (iterator.includes(":")) {
    //     const splitData = iterator.split(":");
    //     objects[splitData[1]] = "$" + splitData[0];
    //   } else {
    //     objects[iterator] = 1;
    //   }
    // }
    // console.log(objects);
  
    return objects;
  };

  const dataNumber = ["code"];

  export const extractLikeQuery = (select: string, search: string) => {
    let objects = [];
    // { name: { $regex: substring, $options: 'i' } }
    if (search.length != 0) {
      const regex = new RegExp(search, "i");
      for (const iterator of select.split(" ").filter((e) => e)) {
        if (dataNumber.includes(iterator)) {
          objects.push({
            $expr: {
              $regexMatch: {
                input: { $toString: `$${iterator}` },
                regex: regex,
              },
            },
          });
        } else {
          objects.push({ [iterator]: { $regex: regex } });
        }
      }
      console.log(objects);
  
      if (objects.length) {
        return {
          $or: objects,
        };
      }
    }
    return {};
  };


export const paginationQueryBuilder = async ({
    _model,
    select,
    likeSearch,
    query,
    populate,
    where,
    
  }: paginationQueryBuilderProps) => {
    try {
      // { path: "parentId", select: "name" }
      const { page, limit, skip, search, sort, sortColumn } =
        getPaginationParams(query);
      let findQuery = likeSearch
        ? extractLikeQuery(likeSearch, search ?? "")
        : {};
      if (where) {
        findQuery = Object.assign(findQuery, where);
      }
      console.log(findQuery);
  
      let data = _model
        .find(findQuery, extractSelect(select))
        .skip(skip)
        .limit(limit);
      if (sortColumn) {
        console.log(sortColumn);
  
        let sortData: { [key: string]: any } = {};
        sortData[toCamelCase(sortColumn)] =
          sort?.toLocaleLowerCase() == "asc" ? 1 : -1;
        data.sort(sortData);
      }
  
      for (let iterator of populate ?? []) {
        iterator["select"] = extractSelect(iterator.select ?? "");
        data.populate(iterator);
      }
      let dataResponse = await data.exec();
      
  
      // return;
  
      const totalSize = await _model.countDocuments(findQuery);
      const pageSize = Math.ceil(totalSize / limit);
      const pageData = {
        totalSize,
        pageSize,
        page,
        perPage: limit,
        data: dataResponse,
      };
      return pageData;
    } catch (error: any) {
      console.log(error);
      throw new Error(error);
    }
  };
  