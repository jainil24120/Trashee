const Dustbin = require('../models/Dustbin');

exports.createDustbin = async (req, res) => {
    try {
        const { binCode, location, type, pincode } = req.body;
        const newDustbin = new Dustbin({ binCode, location, type, pincode });
        await newDustbin.save();
        res.status(201).json({ message: 'Dustbin created successfully', dustbin: newDustbin });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.getDdustbin = async (req,res) => {
    try {
        const dustbins = await Dustbin.find();
        res.json(dustbins);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}

exports.updateDustbin = async (req,res)=>{
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const updatedDustbin = await Dustbin.findByIdAndUpdate(id, updatedData, { new: true });
    
        if (!updatedDustbin) return res.status(404).json({ error: 'Dustbin not found' });
        res.json({ message: 'Dustbin updated successfully', dustbin: updatedDustbin });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}

exports.deleteDustbin = async (req,res)=>{
    try {
        const { id } = req.params;
        const deletedDustbin = await Dustbin.findByIdAndDelete(id);
    
        if (!deletedDustbin) return res.status(404).json({ error: 'Dustbin not found' });
        res.json({ message: 'Dustbin deleted successfully' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}

