# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Store, type: :model do
  describe 'Attributes' do
    it { should respond_to :name }
  end

  describe 'Associations' do
    it { should have_many(:store_items).dependent :destroy }
    it { should have_many(:items).through :store_items }
  end

  describe 'Validations' do
    it { should validate_presence_of :name }
    it { should validate_uniqueness_of(:name).case_insensitive }
  end
end
