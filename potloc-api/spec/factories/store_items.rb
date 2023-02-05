# frozen_string_literal: true

FactoryBot.define do
  factory :store_item do
    store { create(:store) }
    item { create(:item) }
    sequence(:inventory) { |n| n }
  end
end
