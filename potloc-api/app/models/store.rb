# frozen_string_literal: true

class Store < ApplicationRecord
  has_many :store_items, dependent: :destroy
  has_many :items, through: :store_items
  validates :name, presence: true, uniqueness: { case_sensitive: false }
end
