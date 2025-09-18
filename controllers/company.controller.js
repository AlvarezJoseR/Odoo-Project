const companyService = require('./../services/company.service')

exports.getAllCompanies = async (req, res) => {
    try {
        filters = [];
        if (req.query) {
            for (const [key, value] of Object.entries(req.query)) {
                if (value !== undefined) {
                    filters.push([key, 'ilike', value]);
                }
            }
        }
        const response = await companyService.getAllCompanies(req.session.user, filters);
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.getCompanyfields = async (req, res) => {
    try {
        const response = await companyService.getCompanyfields(req.session.user);
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};