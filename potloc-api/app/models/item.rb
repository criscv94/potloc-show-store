# frozen_string_literal: true

class Item < ApplicationRecord
  has_many :store_items, dependent: :destroy
  has_many :stores, through: :store_items
  validates :name, presence: true, uniqueness: { case_sensitive: false }
end
