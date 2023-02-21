# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'StoreItem', type: :request do
  describe 'Index' do
    context 'with no store items created' do
      before { get '/store_items' }
      it 'should be ok' do
        json_response = JSON.parse(response.body, symbolize_names: true)
        expect(response).to be_successful
        expect(json_response[:data]).to be_empty
      end
    end

    context 'with valid store items in database' do
      before do
        @store_item = create(:store_item)
        get '/store_items'
      end

      it 'return an array' do
        json_response = JSON.parse(response.body, symbolize_names: true)
        expect(response).to be_successful
        expect(json_response[:data]).to be_an_instance_of(Array)
        expect(json_response[:data].length).to be 1
        store_item_response = json_response[:data].first
        expect(store_item_response[:id].to_i).to eq @store_item.id
        expect(store_item_response[:attributes][:inventory]).to eq @store_item.inventory
        expect(store_item_response[:attributes][:modelName]).to eq @store_item.item.name
      end
    end
  end

  describe 'Update' do
    context 'with no store items created' do
      before { put '/store_items/0', params: { inventory: 5 } }

      it 'should return not found' do
        expect(response).not_to be_successful
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'with valid store items in database' do
      before do
        @store_item = create(:store_item)
        put "/store_items/#{@store_item.id}", params: { inventory: 5 }
      end
      
      it 'should return no content' do
        expect(response).to be_successful
        expect(response).to have_http_status(:no_content)
      end

      it 'should broadcast to store id' do
        expect(response).to be_successful
        expect(response).to have_http_status(:no_content)
      end

      it 'should enqueue recommendation job' do
        expect(response).to be_successful
        expect(response).to have_http_status(:no_content)
        expect(RecommendJob).to have_been_enqueued.with(@store_item.id.to_s)
      end
    end
  end
end
