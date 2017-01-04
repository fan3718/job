
function VelocityWebpackPlugin(options){
	
}


VelocityWebpackPlugin.prototype.apply = function(compiler){
	compiler.plugin('done', function() {
	    console.log('VelocityWebpackPlugin!'); 
	});
	
	
	// Setup callback for accessing a compilation:
	compiler.plugin("compilation", function(compilation) {
	    
	    // Now setup callbacks for accessing compilation steps:
	    compilation.plugin("optimize", function() {
	      console.log("Assets are being optimized.");
	    });
	});
	
};


module.exports = VelocityWebpackPlugin;