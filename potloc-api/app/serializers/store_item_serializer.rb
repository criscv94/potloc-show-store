# frozen_string_literal: true

class StoreItemSerializer
  include JSONAPI::Serializer
  set_key_transform :camel_lower
  attributes :inventory, :store_id

  attribute :model_name do |object|
    object.item.name
  end
end
