import FixedBitSet from "./fixedbitset.js"



class Universe {

    constructor(width, height){
        this.width  = width;
        this.height = height;
        this.cells = new FixedBitSet(width * height);
    }

    static new_spaceship(width, height) {
        let u = new Universe(width, height);
        u.insert_glider(width / 2, height / 2);
        return u;
    }

    static new_pattern(width, height) {
        let u = new Universe(width, height);
        let size = width * height;
        for (let i = 0; i < size; i++) {
            if(i %2 === 0 || i % 7 === 0) {
                u.set_cell(i,true);
            }
        }
        return u;
    }

    static new_random(width, height) {
        let u = new Universe(width, height);
        u.random();
        return u;
    }

    get_index (row, column) {
        return row * this.width + column % this.cells.fixedbitset.length;
    }

    live_neighbour_count(row, column){
        let count = 0;
        let north = row == 0 ? this.height - 1: row - 1;
        let south = row == this.height - 1 ? 0: row + 1;
        let west = column == 0 ? this.width - 1: column - 1;
        let east = column == this.width - 1 ? 0: column + 1;

       
        [north,row,south].forEach( (r) => {
            [west, column, east].forEach( (c) => {
                let idx = this.get_index(r,c);
                if(r == row && c == column){
                }else if(this.get_cells().get(idx)){
                    count++;
                }
            });
        });
        return count;
    }


    tick (){
        let next = new FixedBitSet(this.cells.length);
        for (let r = 0; r < this.height; r++) {
            for (let c = 0; c < this.width; c++) {
                let index = this.get_index(r,c);
                let cell = this.cells.get(index);
                let live_neighbours = this.live_neighbour_count(r,c);
                /*if((cell && live_neighbours == 2) | live_neighbours == 3) {
                    cell = true;
                }else{
                    cell = false;
                }*/
                //console.log(live_neighbours);
                cell =  live_neighbours == 3 || (cell && live_neighbours == 2);
                next.set(index, cell);
            }
        }
        this.cells = next;
    }
    get_width(){
        return this.width;
    } 

    get_height(){
        return this.height;
    };

    get_cells(){
        return  this.cells;
    }

    set_cell (n, val){
        this.get_cells().set(n, val);
    }

    toggle_cell(n) {
        this.cells.toggle();
    }

    reset(){
        this.cells.clear();
    }

    random(){
        let size = this.width * this.height;
        for (let i = 0; i < size; i++) {
            this.set_cell(i, Math.random() <0.5);
        }
    }

    insert_glider(r, c){
        let spaceship_coords =[[0,2],[1,0],[1,2],[2,1],[2,2]];
        
        spaceship_coords.forEach(coord => {
                let x = coord[1];
                let y = coord[0];
                let index = this.get_index(r+x, c+y);
                this.set_cell(index, true);
        });
    }

    insert_pulsar(r,c){
        let pulsar_coords =  [[0,2],[0,3],[0,4],[0,8],[0,9],[0,10],[2,0],[2,5],[2,7],[2,12],[3,0],[3,5],[3,7],[3,12],[4,0],[4,5],[4,7],[4,12],[5,2],[5,3],[5,4],[5,8],[5,9],[5,10],
        [7,2],[7,3],[7,4],[7,8],[7,9],[7,10],[8,0],[8,5],[8,7],[8,12],[9,0],[9,5],[9,7],[9,12],[10,0],[10,5],[10,7],[10,12],[12,2],[12,3],[12,4],[12,8],[12,9],[12,10]];
        pulsar_coords.forEach(coord => {
            let x = coord[1];
            let y = coord[0];
            let index = this.get_index(r+x, c+y);
            this.set_cell(index, true);
        });
    }

}
export default Universe;