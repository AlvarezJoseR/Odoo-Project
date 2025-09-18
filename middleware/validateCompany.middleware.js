const companyService = require('./../services/company.service');
const validateCompany = async (req, res, next) => {
    const customer_data = req.body;
        //Verify Company exits
        if (customer_data.hasOwnProperty('company_id')) {
            const company_id = customer_data.company_id;
            const company = await companyService.getAllCompanies(req.session.user, [['id', "=", company_id]])
             if (!company || company.length === 0) return res.status(400).json({ error: `company ${company_id} does not exist ` });
        }
    next(); 
};

module.exports =  validateCompany;