class DealService {
  constructor() {
    this.tableName = 'deal_c';
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "account_id_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "actual_close_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "products_c"}},
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
      console.error("Error fetching deals:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "account_id_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "actual_close_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "products_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response?.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching deal ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(dealData) {
    try {
      const params = {
        records: [{
          Name: dealData.title,
          title_c: dealData.title,
          contact_id_c: parseInt(dealData.contactId),
          account_id_c: dealData.accountId,
          value_c: parseFloat(dealData.value) || 0,
          probability_c: parseInt(dealData.probability) || 0,
          stage_c: dealData.stage || "New",
          expected_close_date_c: dealData.expectedCloseDate,
          status_c: "Open",
          products_c: Array.isArray(dealData.products) ? dealData.products.join('\n') : dealData.products || "",
          notes_c: dealData.notes || ""
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
          console.error(`Failed to create ${failed.length} deals:`, JSON.stringify(failed));
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating deal:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, updateData) {
    try {
      const updateRecord = {
        Id: parseInt(id)
      };

      // Map fields to database schema
      if (updateData.title) updateRecord.title_c = updateData.title;
      if (updateData.title) updateRecord.Name = updateData.title;
      if (updateData.contactId) updateRecord.contact_id_c = parseInt(updateData.contactId);
      if (updateData.accountId) updateRecord.account_id_c = updateData.accountId;
      if (updateData.value !== undefined) updateRecord.value_c = parseFloat(updateData.value) || 0;
      if (updateData.probability !== undefined) updateRecord.probability_c = parseInt(updateData.probability) || 0;
      if (updateData.stage) updateRecord.stage_c = updateData.stage;
      if (updateData.expectedCloseDate) updateRecord.expected_close_date_c = updateData.expectedCloseDate;
      if (updateData.actualCloseDate !== undefined) updateRecord.actual_close_date_c = updateData.actualCloseDate;
      if (updateData.status) updateRecord.status_c = updateData.status;
      if (updateData.products !== undefined) {
        updateRecord.products_c = Array.isArray(updateData.products) ? updateData.products.join('\n') : updateData.products || "";
      }
      if (updateData.notes !== undefined) updateRecord.notes_c = updateData.notes;

      const params = {
        records: [updateRecord]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} deals:`, JSON.stringify(failed));
        }
        
        // Handle auto-client creation logic for won deals
        if (updateData.stage === "Closed Won" && successful.length > 0) {
          try {
            // Note: Auto-client creation would need to be implemented based on business requirements
            console.log(`Deal ${id} closed as won - potential client creation needed`);
          } catch (err) {
            console.log(`Note: Could not auto-create client for deal ${id}:`, err.message);
          }
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating deal:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} deals:`, JSON.stringify(failed));
        }
        
        return successful.length > 0;
      }
    } catch (error) {
      console.error("Error deleting deal:", error?.response?.data?.message || error);
      return false;
    }
  }

  async getByStage(stage) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "account_id_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "actual_close_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "products_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        where: [{"FieldName": "stage_c", "Operator": "ExactMatch", "Values": [stage]}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching deals by stage:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByContact(contactId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "account_id_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "actual_close_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "products_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        where: [{"FieldName": "contact_id_c", "Operator": "ExactMatch", "Values": [parseInt(contactId)]}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching deals by contact:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export default new DealService();