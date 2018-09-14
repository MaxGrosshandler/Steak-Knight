const Taihou = require('taihou');
const weebSH = new Taihou(process.env.wolke, true, {
    userAgent: 'Steak Knight/4.0.0'
});
module.exports = {
  func: async (msg, args) => {
    
    weebSH.toph.getImageTypes()
    .then(array => {
        if (array.types.includes(args[0])){
   try { weebSH.toph.getRandomImage(args[0]).then( image => {

        try {
        msg.channel.createMessage({
            embed: {
                image: {
                    url: image.url
                },
                footer:{
                    text: "Powered by weeb.sh"
                } 

            }
        });
    }
    
    catch (err){
        msg.channel.createMessage("Don't use that thanks")
    }
   }).catch(console.log(""))
}
  catch(err){
      console.log("");
  }
}
else{
    msg.channel.createMessage("Never use `sk weeb`, it only exists as a backend function to work with weeb.sh")
}
})
  },
  options: {
    description: "weeb.sh",
    fullDescription: "don't actually use this",
    usage: "`why are you here`",
    hidden: true
  },
  name: "weeb"
};
