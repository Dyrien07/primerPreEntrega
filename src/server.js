class Productos{
    constructor(nombre){
this.NombreArchivo = nombre;
    }

 async save(producto){
    try {
       const productosTotal = await this.getAll();
       if (productosTotal != "EL ARCHIVO ESTA VACIO" && productosTotal !== [] ){
        const ultimoID = productosTotal[productosTotal.length-1].id+1;
        producto.id = ultimoID;
        productosTotal.push(producto);
     await   fs.promises.writeFile(this.NombreArchivo,JSON.stringify(productosTotal,null,2));
     return producto.id;
    }else {
        producto.id = 1;
     await   fs.promises.writeFile(this.NombreArchivo,JSON.stringify([producto],null,2));
     return producto.id;
    }
       

    } catch (error) {
        return "el producto no se puede grabar"
    }
 }


  async getAll(){
  try {
    const resultado = await fs.promises.readFile(this.NombreArchivo,"utf-8");
  if (resultado.length > 0){
    const prodJson = JSON.parse(resultado);
    return prodJson;    
  
  } else{
    console.log("no hay productos");
    return "EL ARCHIVO ESTA VACIO"
  }   
   
  } catch (error) {
    const archivoNuevo=  await fs.promises.writeFile(this.NombreArchivo,"");  
    return ""
  }

    }

    async getById(unID){
      try {
        const productosTotal = await this.getAll();

        const unProducto = productosTotal.find(elemnto=>elemnto.id === unID)
   if (unProducto){
    return unProducto;
    
   }else{
    return "NO SE ENCUENTRA PRODUCTO"
   }
      } catch (error) {
        console.log("no se encuentra el producto");
      }
    }


    async deleteById(unID){
      try {
        const productosTotal = await this.getAll();
        const Productos = productosTotal.filter(elemnto=>elemnto.id != unID)
        await fs.promises.writeFile(this.NombreArchivo,JSON.stringify(Productos,null,2));
    
        return `Producto ID: ${unID}  fue eliminado con exito`
      } catch (error) {
        console.log("no se encuentra el producto para eliminar");
      }
    }


    async deleteAll(){
      try {
        const productosTotal = await this.getAll();
        
        await fs.promises.writeFile(this.NombreArchivo,"");
    
        return `Se Eliminaron Todos Los Productos`
      } catch (error) {
        console.log("no se puede eliminar los productos");
      }
          }
         async update(id, producto){
        try {
        this.deleteById(id)
          this.save(producto);
      } catch (error) {
        console.log ("error: " + error);
      }


}
}

class Carrito{
    constructor(nombre){
this.NombreArchivo = nombre;
    }

 async save(carrito){
    try {
       const carritoTotal = await this.getAll();
       if (carritoTotal != "EL ARCHIVO ESTA VACIO" && carritoTotal !== [] ){
        const ultimoID = carritoTotal[carritoTotal.length-1].id+1;
        carrito.id = ultimoID;
        carrito.timestamp = Date.now();
        carrito.productos =[];
        carritoTotal.push(carrito);
     await   fs.promises.writeFile(this.NombreArchivo,JSON.stringify(carritoTotal,null,2));
     return carrito.id;
    }else {
        carrito.id = 1;
        carrito.timestamp = Date.now();
        carrito.productos =[];
     await   fs.promises.writeFile(this.NombreArchivo,JSON.stringify([carrito],null,2));
     return carrito.id;
    }
       

    } catch (error) {
        return "el carrito no se puede grabar"
    }
 }


  async getAll(){
  try {
    const resultado = await fs.promises.readFile(this.NombreArchivo,"utf-8");
  if (resultado.length > 0){
    const carritoJson = JSON.parse(resultado);
    return carritoJson;    
  
  } else{
    console.log("no hay productos");
    return "EL ARCHIVO ESTA VACIO"
  }   
   
  } catch (error) {
    const archivoNuevo=  await fs.promises.writeFile(this.NombreArchivo,"");  
    return ""
  }

    }

    async getById(unID){
      try {
        const carritoTotal = await this.getAll();

        const uncarrito = carritoTotal.find(elemnto=>elemnto.id === unID)
   if (uncarrito){
    return uncarrito;
    
   }else{
    return "NO SE ENCUENTRA PRODUCTO"
   }
      } catch (error) {
        console.log("no se encuentra el producto");
      }
    }


    async deleteById(unID){
      try {
        const carritoTotal = await this.getAll();
        const Carritos = carritoTotal.filter(elemnto=>elemnto.id != unID)
        await fs.promises.writeFile(this.NombreArchivo,JSON.stringify(Carritos,null,2));
    
        return `Producto ID: ${unID}  fue eliminado con exito`
      } catch (error) {
        console.log("no se encuentra el producto para eliminar");
      }
    }
    async delProdCarrito(idCarrito,idprod){

        const carritosTotal = await this.getAll();
        const indiceCarr = carritosTotal.findIndex(elemnto=>elemnto.id == idCarrito);
    
        if (indiceCarr >=0){
            const indiceProd = carritosTotal[indiceCarr].productos.findIndex(elemnto =>elemnto== idprod);
    
            if (indiceProd >= 0){
                carritosTotal[indiceCarr].productos.splice(indiceProd,1);
                await   fs.promises.writeFile(this.NombreArchivo,JSON.stringify(carritosTotal,null,2));
            return `Producto nro: ${idprod} eliminado del carrito nro: ${idCarrito}`  
            }else{
               return `Producto nro: ${idprod} no existe}` 
            }            
            
        }else{
    
        return "NO existe el carrito"
        }
      
    
        }

        async agregarProd(unID,carrito){
            try {
                const carritoTotal = await this.getAll();
                const indice = carritoTotal.findIndex(elemnto=>elemnto.id == unID);
        
            if (indice >=0){
        
                carritosTotal[indice].productos.push(carrito.producto);
                await   fs.promises.writeFile(this.NombreArchivo,JSON.stringify(carritoTotal,null,2));
        return "Producto agregado con exito"  
                }else{
        
                return "NO existe el carrito"
            }
                 
               
        
            } catch (error) {
                console.log("llegue aca");
        
                return "el  producto no se puede agregar al carrito"
            }
         }

}





const express = require("express");
const app = express();
const {Router} = express;
const PORT = process.env.port || 8080;
const productos = new Productos(__dirname +"/Productos.txt");
const carrito = new Carrito(__dirname +"/Carrito.txt");
const fs = require("fs");
const admin = true;
const routerProductos = Router();
const routerCarrito = Router();
// Configuraciones
app.use("/api/productos",routerProductos);
app.use("/api/carrito",routerCarrito);

routerProductos.use(express.urlencoded({extended: true}));
routerProductos.use(express.json());
routerCarrito.use(express.urlencoded({extended: true}));
routerCarrito.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.json());


// Server ON
app.listen(PORT,()=>{console.log("Server listen on port " +PORT)});

// Peticiones 
routerProductos.get("/:id",(req,res)=>{
    res.json(productos.getById(req.params.id));
});
routerProductos.post("/",async(req,res)=>{
  if (admin){
    const result = await productos.save(req.body);
    res.json(result);
  }else{
    res.json("permiso Denegado");
  }
   
});
routerProductos.put("/",(req,res)=>{
  if(admin){
    const result = productos.update(req.body);
    res.json(result);
  }else{
    res.json("Permiso Denegado")
  }
   
});
routerProductos.delete("/:id",async(req,res)=>{
  if(admin ){
    const result = await productos.deleteById(req.params.id);
    res.json(result);
  }else{
    res.json("Permiso Denegado")
  }
   
});

routerProductos.get("/", async(req,res)=>{
   const todo = await productos.getAll();
  res.json(todo);
});

routerProductos.post("/",(req,res)=>{
    res.json({error: "Ruta invalida"});
})


routerCarrito.post("/",async(req,res)=>{
    if (admin){
    const result = await carrito.save(req.body);
    res.json(result);
    }else{
        const mensaje = {
            mensaje: "Permiso Denegado"
        }
        res.json(mensaje);

    }
});

routerCarrito.delete("/:id/productos/:idprod",async(req,res)=>{
    if (admin){
        const result = await carrito.delProdCarrito(req.params.id,req.params.idprod);
    res.json(result);
}else{
    const mensaje = {
        mensaje: "Permiso Denegado"
    
    }
    res.json(mensaje);

}

});

routerCarrito.post("/:id/productos",async(req,res)=>{
        if (admin){
        const result = await carrito.agregarProd(req.params.id,req.body);
    console.log(result);   
        res.json(result);
        }else{
            const mensaje = {
                mensaje: "Permiso Denegado", 
            }
            res.json(mensaje);
    
        }
    });

routerCarrito.get("/:id/productos",async (req,res)=>{

    res.json(await carrito.getById(req.params.id));
});