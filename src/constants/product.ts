export const sortBy = {
    createAt: "createAt",
    view: "view",
    sold: "sold",
    price: "price",
} as const; //as const để đảm bảo rằng các giá trị trong object này là readonly, không thể thay đổi được

export const order = {
    asc: "asc",
    desc: "desc",
} as const;
