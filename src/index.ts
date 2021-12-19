import * as http from "http";

enum EDirections {
    Up = "up",
    Down = "down",
    Right = "right",
    Left = "left"
}

enum EActions {
    Tay = "stay",
    Move = "move",
    Eat = "eat",
    Load = "load",
    Unload = "unload"
}

interface ICoordinates {
    x: number;
    y: number;
}

interface IAnt {
    id: number;
    event: string;
    errors: number;
    age: number;
    cargo: number;
    health: number;
    payload: number;
    point: ICoordinates;
}

interface ICanvas {
    width: number;
    height: number;
    cells: ICell[];
}

interface ICell {
    ant?: string;
    hive?: string;
    food?: number;
}

interface IResponse {
    tick: number;
    id: string;
    ants: IAnt[],
    canvas: ICanvas
}

interface IOrder {
    antId: number,
    act: EActions,
    dir: EDirections
}

interface IRequest {
    orders: IOrder[]
}


http.createServer(function (req, res) {
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {

            let response: IResponse = JSON.parse(body)
            let request: IRequest = {orders: []}
            //Loop through ants and give orders
            for (let i in response.ants) {
                let order: IOrder = {
                    antId: response.ants[i].id,
                    act: EActions.Move,
                    dir: EDirections.Down
                }
                request.orders.push(order)
            }
            res.end(JSON.stringify(request));

            console.log(JSON.stringify(request))
            // {"orders": [
            //	 {"id":1,"act":"move","dir":"down"},
            //	 {"id":17,"act":"load","dir":"up"}
            //	]}
        });
    } else {
        res.end("only POST allowed");
    }
}).listen(7070);
