class StoreItemSerializer
  include JSONAPI::Serializer
  set_key_transform :camel_lower
  attributes :inventory, :store_id

  attribute :model_name do |object|
    object.item.name
  end

  attribute :store_name do |object|
    object.store.name
  end
end
