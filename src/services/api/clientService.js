class ClientService {
  constructor() {
    this.tableName = 'client_c';
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
          {"field": {"Name": "account_id_c"}},
          {"field": {"Name": "relationship_level_c"}},
          {"field": {"Name": "last_interaction_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching clients:", error?.response?.data?.message || error);
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
          {"field": {"Name": "account_id_c"}},
          {"field": {"Name": "relationship_level_c"}},
          {"field": {"Name": "last_interaction_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response?.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching client ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(clientData) {
    try {
      const params = {
        records: [{
          Name: `${clientData.firstName} ${clientData.lastName}`,
          first_name_c: clientData.firstName,
          last_name_c: clientData.lastName,
          email_c: clientData.email,
          phone_c: clientData.phone,
          company_c: clientData.company,
          job_title_c: clientData.jobTitle,
          account_id_c: clientData.accountId,
          relationship_level_c: clientData.relationshipLevel,
          last_interaction_c: new Date().toISOString(),
          notes_c: clientData.notes || ""
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
          console.error(`Failed to create ${failed.length} clients:`, JSON.stringify(failed));
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating client:", error?.response?.data?.message || error);
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
          account_id_c: updateData.accountId,
          relationship_level_c: updateData.relationshipLevel,
          last_interaction_c: updateData.lastInteraction || new Date().toISOString(),
          notes_c: updateData.notes
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
          console.error(`Failed to update ${failed.length} clients:`, JSON.stringify(failed));
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating client:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} clients:`, JSON.stringify(failed));
        }
        
        return successful.length > 0;
      }
    } catch (error) {
      console.error("Error deleting client:", error?.response?.data?.message || error);
      return false;
    }
  }

  async getByRelationshipLevel(relationshipLevel) {
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
          {"field": {"Name": "account_id_c"}},
          {"field": {"Name": "relationship_level_c"}},
          {"field": {"Name": "last_interaction_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        where: [{"FieldName": "relationship_level_c", "Operator": "ExactMatch", "Values": [relationshipLevel]}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching clients by relationship level:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByCompany(company) {
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
          {"field": {"Name": "account_id_c"}},
          {"field": {"Name": "relationship_level_c"}},
          {"field": {"Name": "last_interaction_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        where: [{"FieldName": "company_c", "Operator": "Contains", "Values": [company]}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching clients by company:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export default new ClientService();