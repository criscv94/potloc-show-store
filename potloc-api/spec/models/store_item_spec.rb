# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StoreItem, type: :model do
  describe 'Attributes' do
    it { should respond_to :inventory }
  end

  describe 'Associations' do
    it { should belong_to(:store) }
    it { should belong_to(:item) }
  end
end
