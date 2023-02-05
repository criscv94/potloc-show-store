# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Store', type: :request do
  describe 'Index' do
    context 'with no store created' do
      before { get '/stores' }
      it 'should be ok' do
        json_response = JSON.parse(response.body, symbolize_names: true)
        expect(response).to be_successful
        expect(json_response[:data]).to be_empty
      end
    end

    context 'with valid stores in database' do
      before do
        @stores = create_list(:store, 5)
        get '/stores'
      end
      it 'return an array' do
        json_response = JSON.parse(response.body, symbolize_names: true)
        expect(response).to be_successful
        expect(json_response[:data]).to be_an_instance_of Array
        expect(json_response[:data].length).to be 5
        json_response[:data].each do |store|
          expect(store[:id]).to be_an_instance_of String
          expect(store[:attributes][:name]).to be_an_instance_of String
        end
      end
    end

  end
end
