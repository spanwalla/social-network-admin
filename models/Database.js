export class Database {
    constructor(collection) {
        this.collection = collection;
    }

    async create(document) {
        try {
            return await this.collection.insertAsync(document);
        } catch (error) {
            throw new Error("Error creating document: " + error.message);
        }
    }

    async updateSet(query, updateSetData) {
        try {
            return await this.collection.updateAsync(query, {$set: updateSetData}, {returnUpdatedDocs: true});
        } catch (error) {
            throw new Error("Error updating document (query: " + query + "): " + error.message);
        }
    }

    async update(query, updateQuery) {
        try {
            return await this.collection.updateAsync(query, updateQuery, {returnUpdatedDocs: true});
        } catch (error) {
            throw new Error("Error updating document (query: " + query + ", " + updateQuery + "): " + error.message);
        }
    }

    async find(query = {}, projection = {}, sort = {}, skip = 0, limit = 0) {
        try {
            let dbQuery = this.collection.findAsync(query, projection).sort(sort);
            if (skip > 0)
                dbQuery = dbQuery.skip(skip);
            if (limit > 0)
                dbQuery = dbQuery.limit(limit);

            return await dbQuery;
        } catch (error) {
            throw new Error("Error finding document (query: " + query + "): " + error.message);
        }
    }

    async count(query = {}) {
        try {
            return await this.collection.countAsync(query);
        } catch (error) {
            throw new Error("Error counting documents (query " + query + "): " + error.message);
        }
    }

    async findOne(query, projection = {}) {
        try {
            return await this.collection.findOneAsync(query, projection);
        } catch (error) {
            throw new Error("Error finding one document (query: " + query + "): " + error.message);
        }
    }

    async findById(id, projection = {}) {
        return await this.findOne({_id: id}, projection);
    }

    async delete(query) {
        try {
            const result = await this.collection.removeAsync(query, {});
            return {query, success: result > 0};
        } catch (error) {
            throw new Error("Error deleting document (query: " + query + "): " + error.message);
        }
    }
}