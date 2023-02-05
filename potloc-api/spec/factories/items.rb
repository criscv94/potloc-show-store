# frozen_string_literal: true

FactoryBot.define do
  factory :item do
    sequence(:name) { |n| "name_#{n}" }
  end
end
