class LeadService {
  constructor() {
    this.tableName = 'lead_c';
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "job_title_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "lead_source_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "created_date_c"}},
          {"field": {"Name": "last_contact_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching leads:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "job_title_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "lead_source_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "created_date_c"}},
          {"field": {"Name": "last_contact_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response?.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching lead ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(leadData) {
    try {
      const params = {
        records: [{
          Name: `${leadData.firstName} ${leadData.lastName}`,
          first_name_c: leadData.firstName,
          last_name_c: leadData.lastName,
          email_c: leadData.email,
          phone_c: leadData.phone,
          company_c: leadData.company,
          job_title_c: leadData.jobTitle,
          industry_c: leadData.industry,
          lead_source_c: leadData.leadSource,
          status_c: leadData.status || "New",
          score_c: parseInt(leadData.score) || 0,
          created_date_c: new Date().toISOString(),
          last_contact_c: new Date().toISOString()
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} leads:`, JSON.stringify(failed));
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating lead:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, updateData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: updateData.firstName && updateData.lastName ? `${updateData.firstName} ${updateData.lastName}` : undefined,
          first_name_c: updateData.firstName,
          last_name_c: updateData.lastName,
          email_c: updateData.email,
          phone_c: updateData.phone,
          company_c: updateData.company,
          job_title_c: updateData.jobTitle,
          industry_c: updateData.industry,
          lead_source_c: updateData.leadSource,
          status_c: updateData.status,
          score_c: updateData.score ? parseInt(updateData.score) : undefined,
          created_date_c: updateData.createdDate,
          last_contact_c: updateData.lastContact || new Date().toISOString()
        }]
      };

      // Remove undefined fields
      Object.keys(params.records[0]).forEach(key => {
        if (params.records[0][key] === undefined) {
          delete params.records[0][key];
        }
      });
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} leads:`, JSON.stringify(failed));
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating lead:", error?.response?.data?.message || error);
      return null;
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} leads:`, JSON.stringify(failed));
        }
        
        return successful.length > 0;
      }
    } catch (error) {
      console.error("Error deleting lead:", error?.response?.data?.message || error);
      return false;
    }
  }

  async getByStatus(status) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "job_title_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "lead_source_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "created_date_c"}},
          {"field": {"Name": "last_contact_c"}}
        ],
        where: [{"FieldName": "status_c", "Operator": "ExactMatch", "Values": [status]}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching leads by status:", error?.response?.data?.message || error);
      return [];
    }
  }
}
export default new LeadService();